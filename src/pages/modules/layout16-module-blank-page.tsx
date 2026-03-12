import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarHeading,
} from '@/layouts/layout-16/components/toolbar';
import { Container } from '@/components/common/container';

interface Layout16ModuleBlankPageProps {
  title: string;
}

export function Layout16ModuleBlankPage({
  title,
}: Layout16ModuleBlankPageProps) {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading title={title} description="" />
        </Toolbar>
      </Container>
      <Container>
        <div />
      </Container>
    </Fragment>
  );
}
