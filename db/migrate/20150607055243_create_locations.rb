class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :name
      t.float :latitude
      t.float :longitude
      t.integer :difficulty
      t.integer :riskiness
      t.string :description
      t.integer :user_id
    end
  end
end
