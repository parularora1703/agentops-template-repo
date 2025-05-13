from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .knowledge_base.data import data  # Absolute import to load knowledge base

app = FastAPI()

# ✅ CORS Middleware (for frontend-backend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace * with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Get list of all cities
@app.get("/cities")
async def get_cities():
    cities = list(data.keys())
    return {"cities": cities}

# ✅ Get list of branches in a city
@app.get("/branches/{city_name}")
async def get_branches(city_name: str):
    city_data = data.get(city_name)
    if not city_data:
        raise HTTPException(status_code=404, detail=f"City '{city_name}' not found")
    return {"city": city_name, "branches": list(city_data.keys())}

# ✅ Get list of available days in a branch
@app.get("/days/{city_name}/{branch_name}")
async def get_days(city_name: str, branch_name: str):
    city_data = data.get(city_name)
    if not city_data:
        raise HTTPException(status_code=404, detail=f"City '{city_name}' not found")
    
    branch_data = city_data.get(branch_name)
    if not branch_data:
        raise HTTPException(status_code=404, detail=f"Branch '{branch_name}' not found in {city_name}")
    
    instructions = branch_data.get("instructions")
    if not instructions:
        raise HTTPException(status_code=404, detail=f"No instructions found for branch '{branch_name}'")
    
    return {"city": city_name, "branch": branch_name, "days": list(instructions.keys())}

# ✅ Get slot data for a specific day
@app.get("/slots/{city_name}/{branch_name}/{day}")
async def get_slots(city_name: str, branch_name: str, day: str):
    city_data = data.get(city_name)
    if not city_data:
        raise HTTPException(status_code=404, detail=f"City '{city_name}' not found")
    
    branch_data = city_data.get(branch_name)
    if not branch_data:
        raise HTTPException(status_code=404, detail=f"Branch '{branch_name}' not found in {city_name}")
    
    instructions = branch_data.get("instructions")
    if not instructions or day not in instructions:
        raise HTTPException(status_code=404, detail=f"No available slots for '{day}' in '{branch_name}'")
    
    return {"city": city_name, "branch": branch_name, "day": day, "slots": instructions[day]}

# ✅ Get complete knowledge base for a branch
@app.get("/knowledge/{city_name}/{branch_name}")
async def get_knowledge(city_name: str, branch_name: str):
    city_data = data.get(city_name)
    if not city_data:
        raise HTTPException(status_code=404, detail=f"City '{city_name}' not found")
    
    branch_data = city_data.get(branch_name)
    if not branch_data:
        raise HTTPException(status_code=404, detail=f"Branch '{branch_name}' not found in {city_name}")
    
    return {"city": city_name, "branch": branch_name, "data": branch_data}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)