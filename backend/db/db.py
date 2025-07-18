from supabase import create_client, Client
import os
# Load environment variables
from dotenv import load_dotenv

load_dotenv()

# Replace these with your Supabase project info
# SUPABASE_URL = "https://prlwaaxzuvszmcadnjhw.supabase.co"
# SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybHdhYXh6dXZzem1jYWRuamh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjk1OTcsImV4cCI6MjA2NzkwNTU5N30.ZasziGaOyemTyZE7FQMwvv56Pxof40-ylaBcgqQHHQM"
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_client() -> Client:
    """
    Returns the Supabase client instance.
    """
    return supabase