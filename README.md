setup guide: https://www.debugandrelease.com/creating-a-simple-electron-application/

to develop
`npm run dev-server`
`npm run dev`

to build
`npm run dist`

todo list:
- the timer value is wrong
- we need a list, showing each record, then we can do the update
- the graph to show the time utilization
- the date is wrong:
```
[
  {
    "date": "2023-12-16",
    "start_time": "20:10",
    "end_time": "22:00",
    "type": 1
  },
  {
    "date": "2023-12-16",
    "start_time": "08:40",
    "end_time": "11:20",
    "type": 1
  }
]```
I run it on 2023-12-15 at night but it shows as 2023-12-16, I think it's because we're using UTC string instead of local time string. Let's use UTC string in date and convert to local time string when display.