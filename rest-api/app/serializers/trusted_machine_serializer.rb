class TrustedMachineSerializer < ActiveModel::Serializer
  attributes :id, :checksum, :info
end
