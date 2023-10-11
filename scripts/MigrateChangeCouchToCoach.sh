DB_NAME="Job-Tracker"
COLLECTION_NAME="couches"  

# Backup the collection
mongodump --db $DB_NAME --collection $DB_NAME.$COLLECTION_NAME

mongo <<EOF
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
