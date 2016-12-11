class TrustedMachine < ApplicationRecord
  validates :checksum, uniqueness: true

  before_save :save_checksum

  def save_checksum
    self.checksum = TrustedMachine.generate_checksum info
    self.info = info
  end

  # Generate a unique checksum for the machine.
  def self.generate_checksum(info)
    Digest::SHA256.hexdigest info.to_json.to_s
  end
end
