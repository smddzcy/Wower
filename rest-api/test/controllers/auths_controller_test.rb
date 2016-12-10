require 'test_helper'

class AuthsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @auth = auths(:one)
  end

  test "should get index" do
    get auths_url, as: :json
    assert_response :success
  end

  test "should create auth" do
    assert_difference('Auth.count') do
      post auths_url, params: { auth: { trusted_ips: @auth.trusted_ips, trusted_machines: @auth.trusted_machines } }, as: :json
    end

    assert_response 201
  end

  test "should show auth" do
    get auth_url(@auth), as: :json
    assert_response :success
  end

  test "should update auth" do
    patch auth_url(@auth), params: { auth: { trusted_ips: @auth.trusted_ips, trusted_machines: @auth.trusted_machines } }, as: :json
    assert_response 200
  end

  test "should destroy auth" do
    assert_difference('Auth.count', -1) do
      delete auth_url(@auth), as: :json
    end

    assert_response 204
  end
end
