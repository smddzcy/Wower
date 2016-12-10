class LogSerializer < ActiveModel::Serializer
  attributes :id, :ip_address, :machine_info, :time
  has_one :ufile
end
