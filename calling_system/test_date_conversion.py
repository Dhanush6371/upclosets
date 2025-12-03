#!/usr/bin/env python3
"""
Test script for date conversion functionality
"""

from datetime import datetime, timedelta
import re

def convert_relative_date_to_exact_date(date_str: str) -> str:
    """
    Convert relative date expressions to exact dates.
    
    Examples:
    - "tomorrow" -> "2024-01-15"
    - "day after tomorrow" -> "2024-01-16" 
    - "next monday" -> "2024-01-15"
    - "next tuesday" -> "2024-01-16"
    - "next week" -> "2024-01-15" (next Monday)
    """
    if not date_str:
        return date_str
    
    # Convert to lowercase for easier matching
    date_lower = date_str.lower().strip()
    
    # Get current date
    today = datetime.now()
    
    # Handle "tomorrow"
    if date_lower in ["tomorrow", "tom"]:
        tomorrow = today + timedelta(days=1)
        return tomorrow.strftime("%Y-%m-%d")
    
    # Handle "day after tomorrow"
    if date_lower in ["day after tomorrow", "day after", "day after tom"]:
        day_after_tomorrow = today + timedelta(days=2)
        return day_after_tomorrow.strftime("%Y-%m-%d")
    
    # Handle "next [day of week]"
    days_of_week = {
        'monday': 0, 'mon': 0,
        'tuesday': 1, 'tue': 1, 'tues': 1,
        'wednesday': 2, 'wed': 2,
        'thursday': 3, 'thu': 3, 'thur': 3, 'thurs': 3,
        'friday': 4, 'fri': 4,
        'saturday': 5, 'sat': 5,
        'sunday': 6, 'sun': 6
    }
    
    # Check for "next [day]" pattern
    for day_name, day_num in days_of_week.items():
        if f"next {day_name}" in date_lower or f"next {day_name[:3]}" in date_lower:
            # Calculate days until next occurrence of that day
            days_ahead = day_num - today.weekday()
            if days_ahead <= 0:  # Target day already happened this week
                days_ahead += 7
            next_day = today + timedelta(days=days_ahead)
            return next_day.strftime("%Y-%m-%d")
    
    # Handle "next week" (assume next Monday)
    if date_lower in ["next week", "next wk"]:
        days_until_monday = (7 - today.weekday()) % 7
        if days_until_monday == 0:  # Today is Monday
            days_until_monday = 7
        next_monday = today + timedelta(days=days_until_monday)
        return next_monday.strftime("%Y-%m-%d")
    
    # Handle "this [day]" (if it's in the future)
    for day_name, day_num in days_of_week.items():
        if f"this {day_name}" in date_lower or f"this {day_name[:3]}" in date_lower:
            days_ahead = day_num - today.weekday()
            if days_ahead >= 0:  # Day is this week and hasn't passed
                this_day = today + timedelta(days=days_ahead)
                return this_day.strftime("%Y-%m-%d")
            else:  # Day already passed this week, get next week's occurrence
                days_ahead += 7
                next_week_day = today + timedelta(days=days_ahead)
                return next_week_day.strftime("%Y-%m-%d")
    
    # If no pattern matches, return the original string
    # (might be an already formatted date like "2024-01-15")
    return date_str

def test_date_conversion():
    """Test the date conversion function with various inputs"""
    
    test_cases = [
        "tomorrow",
        "tom",
        "day after tomorrow", 
        "day after",
        "next monday",
        "next tuesday",
        "next wednesday",
        "next thursday",
        "next friday",
        "next saturday",
        "next sunday",
        "next mon",
        "next tue",
        "next wed",
        "next thu",
        "next fri",
        "next sat",
        "next sun",
        "next week",
        "this monday",
        "this tuesday",
        "this wednesday",
        "this thursday",
        "this friday",
        "this saturday",
        "this sunday",
        "2024-01-15",  # Already formatted date
        "January 15, 2024",  # Not handled, should return as-is
        "",  # Empty string
        None,  # None value
    ]
    
    print("Testing date conversion function:")
    print("=" * 50)
    print(f"Current date: {datetime.now().strftime('%A, %B %d, %Y')}")
    print("=" * 50)
    
    for test_input in test_cases:
        try:
            result = convert_relative_date_to_exact_date(test_input)
            print(f"Input: '{test_input}' -> Output: '{result}'")
        except Exception as e:
            print(f"Input: '{test_input}' -> ERROR: {e}")

if __name__ == "__main__":
    test_date_conversion()
