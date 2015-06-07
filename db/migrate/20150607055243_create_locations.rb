class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :name
      t.float :lat
      t.float :lng
      t.integer :difficulty
      t.integer :riskiness
      t.string :description
      t.integer :user_id
    end
  end
end