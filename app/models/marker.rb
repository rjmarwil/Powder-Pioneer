class Marker < ActiveRecord::Base

  belongs_to :user

  validates :name, :difficulty, :riskiness, :description, :lat, :lng, presence: true

end
