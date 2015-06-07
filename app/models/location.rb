class Location < ActiveRecord::Base

  belongs_to :user

  validates :name, :difficulty, :riskiness, :description, presence: true

end
