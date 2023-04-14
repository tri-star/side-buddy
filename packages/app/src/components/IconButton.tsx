import { css } from "@emotion/react"
import { type IconDefinition } from "@fortawesome/fontawesome-common-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type IconButtonProps = {
  onClick: () => void
  icon: IconDefinition,

}

export function IconButton(props: IconButtonProps) {

  const { icon, onClick } = props
  const buttonStyle = css({
    // padding: '10px 5px',
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
    <button css={buttonStyle} onClick={() => { onClick(); }}><FontAwesomeIcon icon={icon}/></button>
  )
}
