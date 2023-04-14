import { css } from "@emotion/react"

type IconButtonProps = {
  onClick: () => void
  title: string,

}

export function IconButton(props: IconButtonProps) {

  const { title, onClick } = props
  const buttonStyle = css({
    padding: '10px 5px',
    color: 'var(--app-button-foreground)',
    backgroundColor: 'var(--app-button-background)',
    border: '1px solid var(--app-button-border)',
    '&:hover': {
      backgroundColor: 'var(--app-button-hoverBackground)',
    },
    '&:disabled': {
      color: 'var(--app-button-disabledForeground)',
      backgroundColor: 'var(--app-button-disabledBackground)',
    },

  })


  return (
    <button css={buttonStyle} onClick={() => { onClick(); }}>{title}</button>
  )
}
