class User < ActiveRecord::Base
  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :password, :password_confirmation, presence: true

  has_many :locations

end
