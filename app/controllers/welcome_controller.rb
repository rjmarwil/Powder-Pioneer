class WelcomeController < ApplicationController

  def index
    # weather = Weather.new
    # if params[:location] == nil
    #   @location = "Denver, CO"
    # else
    #   @location = params[:location]
    # end
    # @info = weather.five_day
    @locations = Location.all
  end

  def new
    @location = Location.new
  end

  def create
    @location = Location.new(location_params)
    if @location.save
      render json: @location.to_json
    else
      render :new
    end
  end

  def destroy
    @location = Location.find_by(params[:id])
    @location.destroy
    render nothing: true
  end

private

  def location_params
    params.require(:location).permit(:name, :difficulty, :riskiness, :description)
  end

end
