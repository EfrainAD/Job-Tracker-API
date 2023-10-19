DB_NAME="Job-Tracker"
COLLECTION_NAME="jobs"  

Backup the collection
mongodump --db $DB_NAME --collection $COLLECTION_NAME

mongo <<EOF
use $DB_NAME

db.jobs.updateMany(
   {},
   {\$rename: {'jobURL': 'jobBoardURL'} }
)
EOF
