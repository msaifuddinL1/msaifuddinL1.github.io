interface ButtonLinkLabelProps {
    link: string,
    label: string,
}

export default function ButtonLinkLabel(props: ButtonLinkLabelProps) {
    return (
      <a
        className="text-center hover:font-extrabold"
        target="_blank"
        href={props.link}
      >
        {props.label}
      </a>
    );
  }