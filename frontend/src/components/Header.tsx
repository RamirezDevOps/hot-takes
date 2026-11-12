import {
    createStyles,
    Header,
    Container,
    Group,
    rem,
} from "@mantine/core";
import { NavLink } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        justifyContent: "start",
        gap: "2rem",
        alignItems: "center",
        height: "100%",
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        },
    },

    linkActive: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).background,
            color: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).color,
        },
    },
}));

interface HeaderSimpleProps {
    links: { link: string; label: string }[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
    const { classes, cx } = useStyles();

    const items = links.map((link) => (
        <NavLink
            key={link.label}
            to={link.link}
            end={link.link === "/"}
            className={({ isActive }) => cx(classes.link, {
                [classes.linkActive]: isActive,
            })}
        >
            {link.label}
        </NavLink>
    ));

    return (
        <Header height={60}>
            <Container className={classes.header}>
                <strong>Hot Takes</strong>
                <Group spacing={5}>
                    {items}
                </Group>
            </Container>
        </Header>
    );
}
