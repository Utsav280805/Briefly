"""
Meeting Processing API Endpoints
Handles AI processing and data retrieval
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from services.vexa_client import VexaClient
from services.ai_service import AIService
from database import get_db, Meeting, Transcript, Summary, ActionItem, Participant, Emotion, init_db
from config import settings
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize Vexa client and AI service
vexa_client = VexaClient(api_key=settings.vexa_api_key, base_url=settings.vexa_base_url)
ai_service = AIService()

# Initialize database on startup
init_db()


class ProcessMeetingRequest(BaseModel):
    """Request to process a meeting"""
    title: Optional[str] = None


@router.post("/{platform}/{meeting_id}/process")
async def process_meeting(
    platform: str,
    meeting_id: str,
    request: ProcessMeetingRequest,
    db: Session = Depends(get_db)
):
    """
    Process a meeting with AI
    Fetches transcript, generates summary, extracts action items, etc.
    """
    try:
        logger.info(f"Processing meeting {meeting_id}")
        
        # 1. Fetch transcript from Vexa
        transcript_result = vexa_client.get_transcript(platform, meeting_id)
        
        if not transcript_result or 'transcript' not in transcript_result:
            raise HTTPException(status_code=404, detail="Transcript not found")
        
        # Parse transcript
        transcript_data = transcript_result['transcript']
        if isinstance(transcript_data, str):
            transcript_segments = [{"text": transcript_data}]
            transcript_text = transcript_data
        elif isinstance(transcript_data, list):
            transcript_segments = transcript_data
            transcript_text = "\n".join([
                f"{seg.get('speaker', 'Unknown')}: {seg.get('text', '')}"
                for seg in transcript_segments
            ])
        else:
            transcript_segments = []
            transcript_text = ""
        
        if not transcript_text:
            raise HTTPException(status_code=400, detail="Empty transcript")
        
        # 2. Create or update meeting record
        meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
        if not meeting:
            meeting = Meeting(
                platform=platform,
                meeting_id=meeting_id,
                title=request.title or f"Meeting {meeting_id}",
                status="processing"
            )
            db.add(meeting)
            db.commit()
            db.refresh(meeting)
        else:
            meeting.status = "processing"
            db.commit()
        
        # 3. Save transcript segments
        # Clear existing transcripts
        db.query(Transcript).filter(Transcript.meeting_id == meeting_id).delete()
        
        for segment in transcript_segments:
            transcript_record = Transcript(
                meeting_id=meeting_id,
                speaker=segment.get('speaker'),
                timestamp=segment.get('timestamp'),
                text=segment.get('text', '')
            )
            db.add(transcript_record)
        db.commit()
        
        # 4. Generate AI summary
        summary_data = ai_service.generate_summary(transcript_text)
        
        # Save or update summary
        summary_record = db.query(Summary).filter(Summary.meeting_id == meeting_id).first()
        if summary_record:
            summary_record.summary = summary_data.get('summary', '')
            summary_record.key_points = json.dumps(summary_data.get('key_points', []))
            summary_record.decisions = json.dumps(summary_data.get('decisions', []))
        else:
            summary_record = Summary(
                meeting_id=meeting_id,
                summary=summary_data.get('summary', ''),
                key_points=json.dumps(summary_data.get('key_points', [])),
                decisions=json.dumps(summary_data.get('decisions', []))
            )
            db.add(summary_record)
        db.commit()
        
        # 5. Extract action items
        action_items_data = ai_service.extract_action_items(transcript_text)
        
        # Clear existing action items
        db.query(ActionItem).filter(ActionItem.meeting_id == meeting_id).delete()
        
        for item in action_items_data:
            action_item = ActionItem(
                meeting_id=meeting_id,
                task=item.get('task', ''),
                owner=item.get('owner', ''),
                due_date=item.get('due_date', ''),
                priority=item.get('priority', 'medium'),
                status='todo'
            )
            db.add(action_item)
        db.commit()
        
        # 6. Detect participants
        participants_list = ai_service.detect_participants(transcript_segments)
        
        # Clear existing participants
        db.query(Participant).filter(Participant.meeting_id == meeting_id).delete()
        
        for name in participants_list:
            participant = Participant(
                meeting_id=meeting_id,
                name=name
            )
            db.add(participant)
        db.commit()
        
        # 7. Analyze emotions
        emotions_data = ai_service.analyze_emotions(transcript_text)
        
        # Clear existing emotions
        db.query(Emotion).filter(Emotion.meeting_id == meeting_id).delete()
        
        for emotion in emotions_data:
            emotion_record = Emotion(
                meeting_id=meeting_id,
                timestamp=emotion.get('timestamp', ''),
                emotion=emotion.get('emotion', 'neutral'),
                intensity=emotion.get('intensity', 0.5)
            )
            db.add(emotion_record)
        db.commit()
        
        # 8. Calculate overall emotion score
        overall_score = ai_service.calculate_overall_emotion_score(emotions_data)
        
        # 9. Update meeting status
        meeting.status = "completed"
        db.commit()
        
        logger.info(f"Meeting {meeting_id} processed successfully")
        
        return {
            "success": True,
            "message": "Meeting processed successfully",
            "data": {
                "meeting_id": meeting_id,
                "summary": summary_data.get('summary'),
                "action_items_count": len(action_items_data),
                "participants_count": len(participants_list),
                "overall_emotion_score": overall_score
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to process meeting: {str(e)}")
        # Update meeting status to failed
        if 'meeting' in locals():
            meeting.status = "failed"
            db.commit()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{platform}/{meeting_id}/summary")
async def get_meeting_summary(
    platform: str,
    meeting_id: str,
    db: Session = Depends(get_db)
):
    """Get AI-generated summary for a meeting"""
    try:
        summary = db.query(Summary).filter(Summary.meeting_id == meeting_id).first()
        
        if not summary:
            raise HTTPException(status_code=404, detail="Summary not found. Process the meeting first.")
        
        return {
            "success": True,
            "summary": summary.summary,
            "key_points": json.loads(summary.key_points) if summary.key_points else [],
            "decisions": json.loads(summary.decisions) if summary.decisions else []
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get summary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{platform}/{meeting_id}/action-items")
async def get_action_items(
    platform: str,
    meeting_id: str,
    db: Session = Depends(get_db)
):
    """Get extracted action items for a meeting"""
    try:
        action_items = db.query(ActionItem).filter(ActionItem.meeting_id == meeting_id).all()
        
        return {
            "success": True,
            "action_items": [
                {
                    "id": item.id,
                    "task": item.task,
                    "owner": item.owner,
                    "due_date": item.due_date,
                    "priority": item.priority,
                    "status": item.status
                }
                for item in action_items
            ]
        }
        
    except Exception as e:
        logger.error(f"Failed to get action items: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{platform}/{meeting_id}/participants")
async def get_participants(
    platform: str,
    meeting_id: str,
    db: Session = Depends(get_db)
):
    """Get participants for a meeting"""
    try:
        participants = db.query(Participant).filter(Participant.meeting_id == meeting_id).all()
        
        return {
            "success": True,
            "participants": [
                {
                    "id": p.id,
                    "name": p.name,
                    "email": p.email
                }
                for p in participants
            ]
        }
        
    except Exception as e:
        logger.error(f"Failed to get participants: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{platform}/{meeting_id}/emotions")
async def get_emotions(
    platform: str,
    meeting_id: str,
    db: Session = Depends(get_db)
):
    """Get emotion analysis for a meeting"""
    try:
        emotions = db.query(Emotion).filter(Emotion.meeting_id == meeting_id).all()
        
        emotion_data = [
            {
                "timestamp": e.timestamp,
                "emotion": e.emotion,
                "intensity": e.intensity
            }
            for e in emotions
        ]
        
        overall_score = ai_service.calculate_overall_emotion_score(emotion_data)
        
        return {
            "success": True,
            "overall_score": overall_score,
            "timeline": emotion_data
        }
        
    except Exception as e:
        logger.error(f"Failed to get emotions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{platform}/{meeting_id}/status")
async def get_meeting_status(
    platform: str,
    meeting_id: str,
    db: Session = Depends(get_db)
):
    """Get processing status of a meeting"""
    try:
        meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
        
        if not meeting:
            return {
                "success": True,
                "status": "not_processed",
                "message": "Meeting has not been processed yet"
            }
        
        return {
            "success": True,
            "status": meeting.status,
            "title": meeting.title,
            "date": meeting.date.isoformat() if meeting.date else None
        }
        
    except Exception as e:
        logger.error(f"Failed to get meeting status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
