# Return an Hourly Weather Forecast for Latitude/Longitude Coordinates

## Overview

The `forecast.hours:lookup` endpoint of the Google Maps Platform Weather API
returns up to 240 hours of hourly weather forecast information for a specified
latitude and longitude, starting from the current hour.

For each hour (`interval`), the API returns detailed meteorological metrics
including:

-   Weather conditions (description, type, and icon base URI)
-   Temperature, apparent ("feels like") temperature, dew point, heat index,
    wind chill, and wet bulb temperature
-   Relative humidity and UV index
-   Precipitation probability, type, and quantitative precipitation forecast
    (QPF)
-   Thunderstorm probability
-   Mean sea level air pressure
-   Wind speed, gust, and direction (degrees and cardinal direction)
-   Visibility, cloud cover, and ice thickness
-   Local display date/time and time zone

--------------------------------------------------------------------------------

## Endpoint & Authentication

### HTTP Request

```http
GET https://weather.googleapis.com/v1/forecast/hours:lookup
```

### Required Headers

When making REST requests to this OnePlatform endpoint, always include the usage
attribution header:

-   `X-Goog-Maps-Solution-ID: gmp_git_agentskills_v1`

--------------------------------------------------------------------------------

## Query Parameters

Parameter            | Type      | Required | Description
:------------------- | :-------- | :------- | :----------
`key`                | `string`  | **Yes**  | Your Google Maps Platform API key.
`location.latitude`  | `number`  | **Yes**  | The latitude coordinate of the target location.
`location.longitude` | `number`  | **Yes**  | The longitude coordinate of the target location.
`hours`              | `integer` | No       | Total number of forecast hours to retrieve, starting from the current hour. Defaults to `240` (maximum `240`).
`pageSize`           | `integer` | No       | Number of hours of forecast data to return per response page. Defaults to `24`.
`pageToken`          | `string`  | No       | Token from a previous response's `nextPageToken` field used to retrieve the next page of results.

--------------------------------------------------------------------------------

## Implementation Workflow

### 1. Basic Request (Scoped to Specific Hours)

By default, the endpoint returns 240 hours of data paginated at 24 hours per
page. To request a smaller window (for example, the next 3 hours), specify the
`hours` parameter.

#### cURL Example

```bash
curl -X GET \
  -H "X-Goog-Maps-Solution-ID: gmp_git_agentskills_v1" \
  "https://weather.googleapis.com/v1/forecast/hours:lookup?key=YOUR_API_KEY&location.latitude=37.4220&location.longitude=-122.0841&hours=3"
```

#### JavaScript (`fetch`) Example

```javascript
async function getHourlyForecast(latitude, longitude, hours = 24) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = new URL('https://weather.googleapis.com/v1/forecast/hours:lookup');

  url.searchParams.append('key', apiKey);
  url.searchParams.append('location.latitude', latitude);
  url.searchParams.append('location.longitude', longitude);
  url.searchParams.append('hours', hours);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1'
    }
  });

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
```

--------------------------------------------------------------------------------

### 2. Handling Pagination (`pageSize` and `pageToken`)

When requesting a total number of `hours` greater than `pageSize` (or greater
than the default `24`), the response includes a `nextPageToken`. Pass this token
as the `pageToken` parameter in subsequent requests while keeping the original
query parameters consistent.

> **Important:** Pagination tokens become invalid if weather data is unavailable
> for at least one of the hours in the specified time period. Passing an invalid
> token to `pageToken` returns an API error.

#### Step 1: Request Initial Page

Request 25 total hours with 3 hours per page:

```bash
curl -X GET \
  -H "X-Goog-Maps-Solution-ID: gmp_git_agentskills_v1" \
  "https://weather.googleapis.com/v1/forecast/hours:lookup?key=YOUR_API_KEY&location.latitude=37.4220&location.longitude=-122.0841&hours=25&pageSize=3"
```

#### Step 2: Request Subsequent Page

Extract `nextPageToken` from the Step 1 JSON response and pass it into
`pageToken`:

```bash
curl -X GET \
  -H "X-Goog-Maps-Solution-ID: gmp_git_agentskills_v1" \
  "https://weather.googleapis.com/v1/forecast/hours:lookup?key=YOUR_API_KEY&location.latitude=37.4220&location.longitude=-122.0841&hours=25&pageSize=3&pageToken=ChYKEgm8dJMYBLZCQBH-ZffkYYVewBAZEAMYAyIMCLKClb0GEJeO18kDKhNBbWVyaWNhL0xvc19BbmdlbGVz"
```

#### JavaScript Paginated Fetch Example

```javascript
async function getAllRequestedForecastHours(latitude, longitude, totalHours = 48, pageSize = 24) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  let allForecastHours = [];
  let pageToken = null;

  do {
    const url = new URL('https://weather.googleapis.com/v1/forecast/hours:lookup');
    url.searchParams.append('key', apiKey);
    url.searchParams.append('location.latitude', latitude);
    url.searchParams.append('location.longitude', longitude);
    url.searchParams.append('hours', totalHours);
    url.searchParams.append('pageSize', pageSize);

    if (pageToken) {
      url.searchParams.append('pageToken', pageToken);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1'
      }
    });

    if (!response.ok) {
      throw new Error(`Weather API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.forecastHours) {
      allForecastHours.push(...data.forecastHours);
    }

    pageToken = data.nextPageToken || null;
  } while (pageToken);

  return allForecastHours;
}
```

--------------------------------------------------------------------------------

## Response Structure

The JSON response contains a `forecastHours` array, a `timeZone` object, and an
optional `nextPageToken`.

```json
{
  "forecastHours": [
    {
      "interval": {
        "startTime": "2025-02-05T23:00:00Z",
        "endTime": "2025-02-06T00:00:00Z"
      },
      "displayDateTime": {
        "year": 2025,
        "month": 2,
        "day": 5,
        "hours": 15,
        "utcOffset": "-28800s"
      },
      "isDaytime": true,
      "weatherCondition": {
        "iconBaseUri": "https://maps.gstatic.com/weather/v1/sunny",
        "description": {
          "text": "Sunny",
          "languageCode": "en"
        },
        "type": "CLEAR"
      },
      "temperature": {
        "degrees": 12.7,
        "unit": "CELSIUS"
      },
      "feelsLikeTemperature": {
        "degrees": 12,
        "unit": "CELSIUS"
      },
      "dewPoint": {
        "degrees": 2.7,
        "unit": "CELSIUS"
      },
      "heatIndex": {
        "degrees": 12.7,
        "unit": "CELSIUS"
      },
      "windChill": {
        "degrees": 12,
        "unit": "CELSIUS"
      },
      "wetBulbTemperature": {
        "degrees": 7.7,
        "unit": "CELSIUS"
      },
      "relativeHumidity": 51,
      "uvIndex": 1,
      "precipitation": {
        "probability": {
          "percent": 0,
          "type": "RAIN"
        },
        "qpf": {
          "quantity": 0,
          "unit": "MILLIMETERS"
        }
      },
      "thunderstormProbability": 0,
      "airPressure": {
        "meanSeaLevelMillibars": 1019.13
      },
      "wind": {
        "direction": {
          "degrees": 335,
          "cardinal": "NORTH_NORTHWEST"
        },
        "speed": {
          "value": 10,
          "unit": "KILOMETERS_PER_HOUR"
        },
        "gust": {
          "value": 19,
          "unit": "KILOMETERS_PER_HOUR"
        }
      },
      "visibility": {
        "distance": 16,
        "unit": "KILOMETERS"
      },
      "cloudCover": 0,
      "iceThickness": {
        "thickness": 0,
        "unit": "MILLIMETERS"
      }
    }
  ],
  "timeZone": {
    "id": "America/Los_Angeles"
  },
  "nextPageToken": "ChYKEgm8dJMYBLZCQBH-ZffkYYVewBAZEAMYAyIMCLKClb0GEJeO18kDKhNBbWVyaWNhL0xvc19BbmdlbGVz"
}
```

### Key Response Fields

-   `forecastHours[].interval`: UTC `startTime` and `endTime` (ISO 8601)
    representing the 1-hour slice.
-   `forecastHours[].displayDateTime`: Local time breakdown (`year`, `month`,
    `day`, `hours`, `utcOffset`) corresponding to the location's time zone.
-   `forecastHours[].weatherCondition`: Contains `type` (e.g., `CLEAR`,
    `RAIN_SHOWERS`, `LIGHT_RAIN`, `CLOUDY`), localized `description.text`, and
    `iconBaseUri`.
-   `forecastHours[].temperature` / `feelsLikeTemperature` / `dewPoint` /
    `heatIndex` / `windChill` / `wetBulbTemperature`: Temperature objects
    containing `degrees` and `unit` (e.g., `CELSIUS`).
-   `forecastHours[].precipitation`: Contains `probability` (`percent` and
    `type` such as `RAIN`) and `qpf` (`quantity` and `unit` such as
    `MILLIMETERS`).
-   `forecastHours[].wind`: Contains `direction` (`degrees` and `cardinal`),
    `speed`, and `gust` (`value` and `unit` such as `KILOMETERS_PER_HOUR`).
-   `timeZone.id`: IANA Time Zone Database identifier (e.g.,
    `America/Los_Angeles`).
