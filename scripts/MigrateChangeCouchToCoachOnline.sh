# # Load environment variables from the .env file using dotenv
source "$(dirname "$0")/../.scripts.env"

DB_NAME="Job-Tracker"
COLLECTION_NAME="couches" 

# Backup the collection
mongodump --uri "$MONGO_URI" --collection $COLLECTION_NAME

mongo "$MONGO_URI" <<EOF
use $DB_NAME

# Rename the collection from "couches" to "coaches"
db.$COLLECTION_NAME.renameCollection("$DB_NAME.coaches")

# Rename the fields within the "coaches" collection
db.coaches.updateMany(
   {},
   {
      $rename: {
         "couch": "coach",
         "couchee": "coachee"
      }
   }
)
EOF
