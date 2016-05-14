# Countdown Timer for React Native
A [package](https://www.npmjs.com/package/react-native-countdown-timer) which is a port of [@uken](https://github.com/uken/)'s [react-countdown-timer](https://github.com/uken/react-countdown-timer) for React Native with animations (coming soon).

## Quick Start
Due to my lack of knowledge in `npm`, the only current way is to add the files directory to your project.
Any guidance in publishing to `npm` properly would be much appreciated.


### Example
```javascript
export default class YourComponent extends Component {
  constructor(props) {
    super(props)
  }

  _onFinish() {
    console.log(`_onFinish`)
  }

  render() {
  	let till = new Date('5/14/2016 13:56:00')
    return (
      <View>
        <CountdownTimer
          till={till}
          onFinish={this._onFinish.bind(this)}
        />
      </View>
    )
  }
}
```


### Props
| Props name        | Type     | Description                                          | Default |
|-------------------|----------|------------------------------------------------------|---------|
| till*             | Date     | A Date object of the datetime end                    |         |
| onTick            | Function | Callback on timer tick                               |         |
| onFinish          | Function | Callback when countdown has finished                 |         |

*required

### Todo (PRs welcome!)
- [ ] Add animations
- [ ] Add default styling to the timer