from fastapi import APIRouter
from backend.knowledge_base.data import knowledge_base
from datetime import datetime

router = APIRouter()

@router.get("/branch/{branch_name}/menu/{day}/{meal_type}")
async def get_menu(branch_name: str, day: str, meal_type: str):
    try:
        # Fetch the branch data from knowledge base
        branch_data = knowledge_base.get(branch_name)
        
        if not branch_data:
            return {"error": "Branch not found"}

        # Check if there are closures for the current day
        today = datetime.now().strftime('%Y-%m-%d')
        closures = branch_data.get('closures', {})
        if today in closures:
            closure_info = closures[today]
            # If meal is closed, suggest alternative meal (e.g., dinner) or provide other relevant info
            if meal_type in closure_info:
                return {"error": f"{meal_type.capitalize()} closed today due to {closure_info.get('reason', 'no specific reason')}. {closure_info.get('suggested_dinner', 'Please try dinner slots instead.')}"}
        
        # Fetch day data
        day_data = branch_data.get(day)
        if not day_data:
            return {"error": f"Data for {day} not found for this branch."}

        # Fetch meal type data
        meal_data = day_data.get(meal_type)
        if not meal_data:
            return {"error": f"Meal type {meal_type} not found for {day}."}

        # Return meal data for the requested branch, day, and meal type
        return {"menu": meal_data}
    
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}