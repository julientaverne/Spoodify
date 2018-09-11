class User < ApplicationRecord
  before_validation :ensure_session_token

  validates :username, :email, presence: true, uniqueness: true
  validates :session_token, :password_digest, presence: true
  validates :password, length: { minimum: 6 }, allow_nil: true
  validate :valid_email

  attr_reader :password

  EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

  def self.find_by_credentials(name_or_email, password)
    if EMAIL_REGEX.match(name_or_email)
      user = User.find_by(email: name_or_email)
    else
      user = User.find_by(username: name_or_email)
    end

    return user if user && user.is_password?(password)
    nil
  end

  def self.generate_session_token
    SecureRandom::urlsafe_base64(16)
  end

  def reset_session_token!
    self.session_token = self.class.generate_session_token
    self.save!
    self.session_token
  end

  def password=(pw)
    @password = pw
    self.password_digest = BCrypt::Password.create(pw)
  end

  def is_password?(pw)
    BCrypt::Password.new(self.password_digest).is_password?(pw)
  end

  private
  
  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end

  def valid_email
    self.errors[:email] << 'must be a valid email' unless EMAIL_REGEX.match(self.email)
  end
end
