import React, {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native'

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
	this.setState({ prevTime: null, timeRemaining: this.getInitialTimeRemaining(newProps.till) });  
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
    const currentTime = Date.now()
    const dt = this.state.prevTime ? (currentTime - this.state.prevTime) : 0
    const interval = 1000

    const timeRemainingInInterval = (interval - (dt % interval))
    let timeout = timeRemainingInInterval

    if (timeRemainingInInterval < (interval / 2.0)) {
      timeout += interval
    }

    const timeRemaining = Math.max(this.state.timeRemaining - dt, 0)
    const countdownComplete = (this.state.prevTime && timeRemaining <= 0)

    if (this.state.isMounted) {
      if (this.state.timeoutId) { clearTimeout(this.state.timeoutId) }
      this.setState({
        timeoutId: countdownComplete ? null : setTimeout(this.tick.bind(this), timeout),
        prevTime: currentTime,
        timeRemaining: timeRemaining
      })
    }

    if (countdownComplete) {
      if (this.props.onFinish) {
        this.props.onFinish()
      }
      return
    }

    if (this.props.onTick) {
      this.props.onTick(timeRemaining)
    }
  }

  getFormattedTime(milliseconds) {
    const totalSeconds = Math.round(milliseconds / 1000)

    let seconds = parseInt(totalSeconds % 60, 10)
    let minutes = parseInt(totalSeconds / 60, 10) % 60
    let hours = parseInt(totalSeconds / 3600, 10)

    seconds = seconds < 10 ? '0' + seconds : seconds
    minutes = minutes < 10 ? '0' + minutes : minutes
    hours = hours < 10 ? '0' + hours : hours

    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }

    return (
      hours + ':' + minutes + ':' + seconds
    )
  }

  renderTick(data) {
    const time = this.getFormattedTime(data)
    return this.props.renderTick(time)
  }

  render() {
    return (
      <View>
          {this.renderTick(this.state.timeRemaining)}
      </View>
    )
  }
}

//  PropTypes

CountdownTimer.propTypes = {
  till: React.PropTypes.object.isRequired,
  onTick: React.PropTypes.func,
  onFinish: React.PropTypes.func,
  renderTick: React.PropTypes.func.isRequired
}

//  Default props

CountdownTimer.defaultProps = {
  onTick: null,
  onFinish: null
}

//  Styles

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ccc'
  }
})