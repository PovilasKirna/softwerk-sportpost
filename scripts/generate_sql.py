import json

# File paths
input_file = 'clubs_by_city_filtered.json'
output_file = 'insert_queries.sql'

# Read JSON data from file
with open(input_file, 'r') as f:
    data = json.load(f)

# Open output file to write queries
with open(output_file, 'w') as f:
    # Iterate through cities and their corresponding clubs
    for city_name, city_data in data.items():
        # Write the SQL query to insert the city using a CTE to capture the ID
        city_name_escaped = city_name.replace("'", "''")  # Escape single quotes for PostgreSQL
        city_endpoint = city_data['endpoint']
        
        f.write(f"WITH inserted_city AS (\n")
        f.write(f"    INSERT INTO cities (name, endpoint)\n")
        f.write(f"    VALUES ('{city_name_escaped}', '{city_endpoint}')\n")
        f.write(f"    RETURNING id\n")
        f.write(f")\n")

        # If there are clubs to insert, write them in a single insert statement
        if city_data['clubs']:
            f.write(f"INSERT INTO clubs (city_id, name, endpoint, image_url)\n")
            f.write(f"SELECT inserted_city.id, club_data.name, club_data.endpoint, club_data.image_url\n")
            f.write(f"FROM inserted_city, (\n")

            # Generate VALUES for clubs
            club_values = []
            for club in city_data['clubs']:
                club_name = club['name'].replace("'", "''")  # Escape single quotes for PostgreSQL
                club_endpoint = club['endpoint']
                club_image = club['image']
                club_values.append(f"    SELECT '{club_name}' AS name, '{club_endpoint}' AS endpoint, '{club_image}' AS image_url")

            # Join the club values using UNION ALL to create a valid subquery
            f.write("\nUNION ALL\n".join(club_values) + "\n")
            f.write(") AS club_data(name, endpoint, image_url);\n\n")

print(f"SQL insert queries have been written to {output_file}")
