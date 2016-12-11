require 'test_helper'

class TrustedMachinesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @trusted_machine = trusted_machines(:one)
  end

  test "should get index" do
    get trusted_machines_url, as: :json
    assert_response :success
  end

  test "should create trusted_machine" do
    assert_difference('TrustedMachine.count') do
      post trusted_machines_url, params: { trusted_machine: { checksum: @trusted_machine.checksum, info: @trusted_machine.info } }, as: :json
    end

    assert_response 201
  end

  test "should show trusted_machine" do
    get trusted_machine_url(@trusted_machine), as: :json
    assert_response :success
  end

  test "should update trusted_machine" do
    patch trusted_machine_url(@trusted_machine), params: { trusted_machine: { checksum: @trusted_machine.checksum, info: @trusted_machine.info } }, as: :json
    assert_response 200
  end

  test "should destroy trusted_machine" do
    assert_difference('TrustedMachine.count', -1) do
      delete trusted_machine_url(@trusted_machine), as: :json
    end

    assert_response 204
  end
end
