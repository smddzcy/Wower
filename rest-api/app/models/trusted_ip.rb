class TrustedIp < ApplicationRecord
  validates :ip, uniqueness: true, allow_nil: false
end
