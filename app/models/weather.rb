class Weather

  attr_accessor :info

  def initialize
    @weather = Faraday.new(:url => "https://api.wunderground.com") do |faraday|
      faraday.request  :url_encoded             # form-encode POST params
      faraday.response :logger                  # log requests to STDOUT
      faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
    end
    @info = []
  end

  def fetch_weather(location=nil)
    response = @weather.get do |req|
      req.url "/api/#{ENV["WEATHER_TOKEN"]}/forecast10day/q/CO/Denver.json"
    end

    JSON.parse(response.body)
  end

  def five_day
    0.upto(4) do |i|
      hash = Hash.new()
      hash[:weekday] = fetch_weather["forecast"]["simpleforecast"]["forecastday"][i]["date"]["weekday_short"]
      hash[:month] = fetch_weather["forecast"]["simpleforecast"]["forecastday"][i]["date"]["month"]
      hash[:day] = fetch_weather["forecast"]["simpleforecast"]["forecastday"][i]["date"]["day"]
      hash[:high] = fetch_weather["forecast"]["simpleforecast"]["forecastday"][i]["high"]["fahrenheit"]
      hash[:low] = fetch_weather["forecast"]["simpleforecast"]["forecastday"][i]["low"]["fahrenheit"]
      hash[:conditions] = fetch_weather["forecast"]["simpleforecast"]["forecastday"][i]["conditions"]
      hash[:icon_url] = fetch_weather["forecast"]["simpleforecast"]["forecastday"][i]["icon_url"]
      hash[:snow] = fetch_weather["forecast"]["simpleforecast"]["forecastday"][i]["snow_allday"]["in"]

      @info << hash
    end
    @info
  end

end
