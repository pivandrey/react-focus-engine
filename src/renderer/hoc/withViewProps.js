export const withViewProps = (WrappedComponent) => {
    return (props) => <WrappedComponent {...props} />
}