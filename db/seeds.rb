# sizes
users_count = 5

# clear out data
%w[
  markers
  users
].each do |table_name|
  ActiveRecord::Base.connection.execute("TRUNCATE TABLE #{table_name}")
end

print "creating users"
# create some users
users_count.times.map do
  print '\(^_^)/ '
  first_name = Faker::Name.first_name
  last_name = Faker::Name.last_name
  full_name = "#{first_name}, #{last_name}"
  User.create(
    email: Faker::Internet.safe_email(full_name),
    password: "password",
    password_confirmation: "password"
  )
end
puts

# create some markers
print "creating locations"
User.all.map do |user|
  print '(o)(o) '
  time = Faker::Time.between(4.hours.ago, Time.now)
  user.markers.create(
    name: Faker::Lorem.sentences(rand(1..2)).join(' '),
    difficulty: [1,2,3,4,5].sample,
    riskiness: [1,2,3,4,5].sample,
    description: Faker::Lorem.sentences(rand(1..4)).join(' '),
    created_at: time,
    updated_at: time,
    lat: [39.7392, 38.8293, 37.9392, 40.4764, 39.6050, 38.8677].sample,
    lng: [-104.9903, -106.1395, -107.8163, -106.8267, -106.5153, -106.9773].sample
  )
end
puts

puts <<EOF

Log in with:
  email:    #{User.first.email}
  password: password
EOF
