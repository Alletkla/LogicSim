import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';

namespace S {
	export const Tray = styled.div`
		min-width: 200px;
		// background: rgb(20, 20, 20);
		// flex-grow: 0;
		// flex-shrink: 0;
	`;
}


export default function TrayWidget(props : PropsWithChildren) {
		return <S.Tray>{props.children}</S.Tray>;
}
