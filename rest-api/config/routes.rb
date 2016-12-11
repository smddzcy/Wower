Rails.application.routes.draw do
  resources :trusted_machines
  resources :trusted_ips
  resources :auths
  resources :ufiles
  resources :logs
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
