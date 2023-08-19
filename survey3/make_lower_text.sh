# RUN WITH: sh make_lower_text.sh ./src/assets/questionnaires
# to make all files in the directory lowercase

# Check for the input directory
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 /path/to/directory"
    exit 1
fi

# Change to the specified directory
cd "$1" || exit

# Loop through each file in the directory
for file in *; do
    # Convert the filename to lowercase and rename the file
    mv -v "$file" "$(echo $file | tr 'A-Z' 'a-z')"
done
