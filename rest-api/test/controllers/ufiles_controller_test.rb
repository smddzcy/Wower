require 'test_helper'

class UfilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @ufile = ufiles(:one)
  end

  test "should get index" do
    get ufiles_url, as: :json
    assert_response :success
  end

  test "should create ufile" do
    assert_difference('Ufile.count') do
      post ufiles_url, params: { ufile: { name: @ufile.name, path: @ufile.path } }, as: :json
    end

    assert_response 201
  end

  test "should show ufile" do
    get ufile_url(@ufile), as: :json
    assert_response :success
  end

  test "should update ufile" do
    patch ufile_url(@ufile), params: { ufile: { name: @ufile.name, path: @ufile.path } }, as: :json
    assert_response 200
  end

  test "should destroy ufile" do
    assert_difference('Ufile.count', -1) do
      delete ufile_url(@ufile), as: :json
    end

    assert_response 204
  end
end
