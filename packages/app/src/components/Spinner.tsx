import { css, keyframes } from "@emotion/react"

export function Spinner(): JSX.Element {

  const gridAnimation = keyframes({
    '0%, 100%': {
      opacity: 1
    },
    '50%': {
      opacity: 0.5
    }
  })

  const style = css({
    display: 'inline-block',
    position: 'relative',
    width: '80px',
    height: '80px',
    '& > div': {
      position: 'absolute',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      background: '#ccc',
      animation: `${gridAnimation} 1.2s linear infinite`,
    },
    '& > div:nth-child(1)': {
      top: '8px',
      left: '8px',
      animationDelay: '0s',
    },
    '& > div:nth-child(2)': {
      top: '8px',
      left: '32px',
      animationDelay: '-0.4s',
    },
    '& > div:nth-child(3)': {
      top: '8px',
      left: '56px',
      animationDelay: '-0.8s',
    },
    '& > div:nth-child(4)': {
      top: '32px',
      left: '8px',
      animationDelay: '-0.4s',
    },
    '& > div:nth-child(5)': {
      top: '32px',
      left: '32px',
      animationDelay: '-0.8s',
    },
    '& > div:nth-child(6)': {
      top: '32px',
      left: '56px',
      animationDelay: '-1.2s',
    },
    '& > div:nth-child(7)': {
      top: '56px',
      left: '8px',
      animationDelay: '-0.8s',
    },
    '& > div:nth-child(8)': {
      top: '56px',
      left: '32px',
      animationDelay: '-1.2s',
    },
    '& > div:nth-child(9)': {
      top: '56px',
      left: '56px',
      animationDelay: '-1.6s',
    },
  })

  return (<div css={style}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    </div>
    )
}
