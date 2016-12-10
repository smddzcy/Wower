class Log < ApplicationRecord
  serialize :machine_info, JSON
end
