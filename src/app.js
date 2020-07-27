import React from 'react'
import { render } from 'react-dom'
import styles from './styles.scss'
import table from './table.json'
import colors from './colors.json'
import clsx from 'clsx'
import 'antd/dist/antd.css'

function toRgb (hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return [r, g, b]
}

class Element extends React.Component {
  onMouseEnter = evt => {
    const { index } = this.props
    this.props.onMouseEnter(index)
  }

  onMouseLeave = evt => {
    const { index } = this.props
    this.props.onMouseLeave(index)
  }

  render () {
    const {
      theme,
      category,
      symbol,
      name,
      atomic_mass,
      xpos,
      ypos
    } = this.props
    const color = theme[category].base
    const hex = toRgb(color['5'])
    return (
      <div
        className={styles.element}
        style={{
          gridColumnStart: xpos,
          gridRowStart: ypos,
          backgroundColor: theme[category].color,
          backgroundImage: `linear-gradient(45deg, ${color['4']} 0%, ${color['6']} 100%)`,
          boxShadow: `0 4px 14px 0 rgba(${hex.join(',')},0.39)`
        }}
        data-symbol={symbol}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div className={styles.header}>
          {name}
        </div>
        <div className={styles.body}>
          {symbol}
        </div>
        <div className={styles.footer}>
          {Math.round(atomic_mass)}
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  state = {
    active: null,
    tooltipStyle: {}
  }
  onMouseEnter = index => {
    const { xpos, ypos } = this.props.elements[index]
    const w = window.innerWidth - 50
    const h = window.innerHeight - 200
    const x = w * (xpos / 18)
    const y = h * (ypos / 10)

    this.setState({
      active: index,
      tooltipStyle: {
        transform: `translate(${x}px, ${y}px)`,
        opacity: 1
      }
    })
  }

  onMouseLeave = index => {
    this.setState({ active: index, tooltipStyle: {} })
  }

  render () {
    const { active, tooltipStyle } = this.state
    const { elements, theme } = this.props
    const tooltipClassName = clsx(styles.tooltip, {
      [styles.active]: active !== null
    })
    return (
      <div className={styles.root}>
        <div className={styles.grid}>
          {
            elements.map((elem, index) => (
              <Element
                key={index}
                {...elem}
                {...this.props}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                index={index}
              />
            ))
          }
        </div>
      </div>
    )
  }
}

const theme = {
  'diatomic nonmetal': {
    base: colors.red,
    color: colors.red['5'],
    borderColor: colors.red['6']
  },
  'noble gas': {
    base: colors.volcano,
    color: colors.volcano['5'],
    borderColor: colors.volcano['6']
  },
  'alkali metal': {
    base: colors.orange,
    color: colors.orange['5'],
    borderColor: colors.orange['6']
  },
  'alkaline earth metal': {
    base: colors.gold,
    color: colors.gold['5'],
    borderColor: colors.gold['6']
  },
  'metalloid': {
    base: colors.yellow,
    color: colors.yellow['5'],
    borderColor: colors.yellow['6'],
  },
  'polyatomic nonmetal': {
    base: colors.lime,
    color: colors.lime['5'],
    borderColor: colors.lime['6']
  },
  'post-transition metal': {
    base: colors.green,
    color: colors.green['5'],
    borderColor: colors.green['6']
  },
  'transition metal': {
    base: colors.cyan,
    color: colors.cyan['5'],
    borderColor: colors.cyan['5']
  },
  'lanthanide': {
    base: colors.blue,
    color: colors.blue['5'],
    borderColor: colors.blue['6']
  },
  'actinide': {
    base: colors.geekblue,
    color: colors.geekblue['5'],
    borderColor: colors.geekblue['6']
  },
  'unknown, probably transition metal': {
    base: colors.purple,
    color: colors.purple['5'],
    borderColor: colors.purple['6']
  },
  'unknown, probably post-transition metal': {
    base: colors.magenta,
    color: colors.magenta['5'],
    borderColor: colors.magenta['6']
  },
  'unknown, probably metalloid': {
    base: colors.red,
    color: colors.red['2'],
    borderColor: colors.red['3']
  },
  'unknown, predicted to be noble gas': {
    base: colors.volcano,
    color: colors.volcano['2'],
    borderColor: colors.volcano['3']
  },
  'unknown, but predicted to be an alkali metal': {
    base: colors.orange,
    color: colors.orange['2'],
    borderColor: colors.orange['3']
  }
}

render(
  <App elements={table.elements} theme={theme} />,
  document.getElementById('root')
)
