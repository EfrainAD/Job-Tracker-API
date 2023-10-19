source "$(dirname "$0")/../.scripts.env"

DB_NAME="Job-Tracker"
COLLECTION_NAME="jobs"  

# Backup the collection
mongodump --uri "$MONGO_URI" --collection $COLLECTION_NAME

mongosh "$MONGO_URI" <<EOF
use $DB_NAME

db.jobs.updateMany(
   {},
   {\$rename: {'jobURL': 'jobBoardURL'} }
)
EOF
