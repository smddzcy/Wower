class UfileSerializer < ActiveModel::Serializer
  attributes :id, :name, :path, :data, :last_access_time

  def last_access_time
    return nil if object.logs.blank?
    object.logs.last.time
  end
end
