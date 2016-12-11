require 'test_helper'

class TrustedIpsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @trusted_ip = trusted_ips(:one)
  end

  test "should get index" do
    get trusted_ips_url, as: :json
    assert_response :success
  end

  test "should create trusted_ip" do
    assert_difference('TrustedIp.count') do
      post trusted_ips_url, params: { trusted_ip: { ip: @trusted_ip.ip } }, as: :json
    end

    assert_response 201
  end

  test "should show trusted_ip" do
    get trusted_ip_url(@trusted_ip), as: :json
    assert_response :success
  end

  test "should update trusted_ip" do
    patch trusted_ip_url(@trusted_ip), params: { trusted_ip: { ip: @trusted_ip.ip } }, as: :json
    assert_response 200
  end

  test "should destroy trusted_ip" do
    assert_difference('TrustedIp.count', -1) do
      delete trusted_ip_url(@trusted_ip), as: :json
    end

    assert_response 204
  end
end
