import React, {Component, StyleSheet, Text, View} from 'react-native'

export default class CountdownTimer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeRemaining: this.getInitialTimeRemaining(this.props.till),
      timeoutId: null,
      prevTime: null,
      isMounted: true
    }
  }

  componentDidMount() {
    this.tick()
  }

  componentWillReceiveProps(newProps) {
    if (this.state.timeoutId) clearTimeout(this.state.timeoutId)
    this.setState({prevTime: null, timeRemaining: newProps.initialTimeRemaining})
  }

  componentDidUpdate() {
    if ((!this.state.prevTime) && this.state.timeRemaining > 0 && this.state.isMounted) {
      this.tick()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId)
    this.setState({isMounted: false})
  }

  getInitialTimeRemaining(till) {
    return Math.abs(till.getTime() - new Date().getTime())
  }

  tick() {
    // console.error(this.state)
    var currentTime = Date.now()
    var dt = this.state.prevTime ? (currentTime - this.state.prevTime) : 0
    var interval = this.props.interval

    // correct for small variations in actual timeout time
    var timeRemainingInInterval = (interval - (dt % interval))
    var timeout = timeRemainingInInterval

    if (timeRemainingInInterval < (interval / 2.0)) {
      timeout += interval
    }

    var timeRemaining = Math.max(this.state.timeRemaining - dt, 0)
    var countdownComplete = (this.state.prevTime && timeRemaining <= 0)

    if (this.state.isMounted) {
      if (this.state.timeoutId) { clearTimeout(this.state.timeoutId) }
      this.setState({
        timeoutId: countdownComplete ? null : setTimeout(this.tick.bind(this), timeout),
        prevTime: currentTime,
        timeRemaining: timeRemaining
      })
    }

    if (countdownComplete) {
      if (this.props.completeCallback) { this.props.completeCallback() }
      return
    }

    if (this.props.tickCallback) {
      this.props.tickCallback(timeRemaining)
    }
  }

  getFormattedTime(milliseconds) {
    if (this.props.formatFunc) {
      return this.props.formatFunc(milliseconds)
    }

    var totalSeconds = Math.round(milliseconds / 1000)

    var seconds = parseInt(totalSeconds % 60, 10)
    var minutes = parseInt(totalSeconds / 60, 10) % 60
    var hours = parseInt(totalSeconds / 3600, 10)

    seconds = seconds < 10 ? '0' + seconds : seconds
    minutes = minutes < 10 ? '0' + minutes : minutes
    hours = hours < 10 ? '0' + hours : hours

    return (
      hours + ':' + minutes + ':' + seconds
    )
  }

  render() {
    const timeRemaining = this.state.timeRemaining
    return (
      <View>
        <Text>
          {this.getFormattedTime(timeRemaining)}
        </Text>
      </View>
    )
  }
}

//  PropTypes

CountdownTimer.propTypes = {
  till: React.PropTypes.object.isRequired,
  overrideStyle: React.PropTypes.bool,
  onFinish: React.PropTypes.func
}

//  Styles

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ccc'
  }
})