# app/views.py
from pymongo import MongoClient
from bson.objectid import ObjectId
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['MongoDB']
collection = db['tasks']

@csrf_exempt
def task_list(request):
    if request.method == 'GET':
        tasks = []
        for task in collection.find():
            task['_id'] = str(task['_id'])  # Convert ObjectId to string
            tasks.append(task)
        return JsonResponse(tasks, safe=False)

    elif request.method == 'POST':
        data = json.loads(request.body)
        new_task = {
            "title": data.get("title", ""),
            "completed": False
        }
        result = collection.insert_one(new_task)
        return JsonResponse({"message": "Task created", "id": str(result.inserted_id)})

@csrf_exempt
def task_detail(request, id):
    try:
        obj_id = ObjectId(id)
    except:
        return JsonResponse({"error": "Invalid ID format"}, status=400)

    if request.method == 'GET':
        task = collection.find_one({"_id": obj_id})
        if not task:
            return JsonResponse({"error": "Task not found"}, status=404)
        task['_id'] = str(task['_id'])
        return JsonResponse(task)

    elif request.method == 'PUT':
        data = json.loads(request.body)
        update_data = {}
        if 'title' in data:
            update_data['title'] = data['title']
        if 'completed' in data:
            update_data['completed'] = data['completed']

        result = collection.update_one({"_id": obj_id}, {"$set": update_data})
        if result.matched_count == 0:
            return JsonResponse({"error": "Task not found"}, status=404)
        return JsonResponse({"message": "Task updated"})

    elif request.method == 'DELETE':
        result = collection.delete_one({"_id": obj_id})
        if result.deleted_count == 0:
            return JsonResponse({"error": "Task not found"}, status=404)
        return JsonResponse({"message": "Task deleted"})
