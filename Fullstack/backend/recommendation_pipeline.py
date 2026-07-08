import os
import pandas as pd
import chromadb
from sentence_transformers import SentenceTransformer

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
DB_DIR = os.path.join(os.path.dirname(__file__), 'chroma_db')
DATASET_PATH = os.path.join(DATA_DIR, 'sample_question_bank.csv')

def run_recommendation_pipeline():
    print("--- Starting AI Question Recommendation Pipeline ---")
    
    # 1. Dataset Import (Kaggle-style Question Bank CSV)
    if not os.path.exists(DATASET_PATH):
        print(f"Error: Dataset not found at {DATASET_PATH}")
        return
        
    print(f"Loading question bank dataset from: {DATASET_PATH}")
    df = pd.read_csv(DATASET_PATH)
    print(f"Loaded {len(df)} questions with columns: {list(df.columns)}")
    
    # 2. Clean Data
    df = df.dropna(subset=['question_id', 'question_text'])
    df = df.drop_duplicates(subset=['question_id'])
    print(f"After cleaning: {len(df)} questions")
    
    # 3. Initialize ChromaDB and Sentence Transformer
    print("Initializing ChromaDB and Embedding Model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    client = chromadb.PersistentClient(path=DB_DIR)
    
    # Reset collection for fresh ingest
    collection_name = "question_bank"
    try:
        client.delete_collection(name=collection_name)
        print("Existing collection cleared.")
    except:
        pass
        
    collection = client.create_collection(
        name=collection_name,
        metadata={"hnsw:space": "cosine"}
    )
    
    # 4. Generate Embeddings and Index into ChromaDB
    print("Generating semantic embeddings for all questions...")
    
    documents = df['question_text'].tolist()
    ids = df['question_id'].tolist()
    
    # Build rich metadata for each question
    metadatas = []
    for _, row in df.iterrows():
        metadatas.append({
            "subject":     str(row.get('subject', '')),
            "topic":       str(row.get('topic', '')),
            "subtopic":    str(row.get('subtopic', '')),
            "difficulty":  str(row.get('difficulty', 'MEDIUM')),
            "bloom_level": str(row.get('bloom_level', '')),
            "marks":       str(row.get('marks', 1)),
            "time_limit":  str(row.get('time_limit_sec', 60)),
            "tags":        str(row.get('tags', '')),
        })
    
    # Encode all documents in batch
    embeddings = model.encode(documents, show_progress_bar=True).tolist()
    
    print(f"Indexing {len(documents)} questions into ChromaDB vector store...")
    collection.add(
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )
    
    print(f"\n[OK] Pipeline Completed! {len(documents)} questions indexed in ChromaDB at: {DB_DIR}")
    print("The AI Recommendation API endpoint is now ready to serve semantic recommendations.")

if __name__ == "__main__":
    run_recommendation_pipeline()
