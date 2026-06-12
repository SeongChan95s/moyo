import { useState } from 'react';
import styles from './MessageInput.module.scss';

interface Props {
	onSend: (content: string) => void;
	disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
	const [value, setValue] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = value.trim();
		if (!trimmed) return;
		onSend(trimmed);
		setValue('');
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			const trimmed = value.trim();
			if (!trimmed) return;
			onSend(trimmed);
			setValue('');
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<textarea
				className={styles.input}
				value={value}
				onChange={e => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="메시지를 입력하세요"
				rows={1}
				disabled={disabled}
			/>
			<button className={styles.sendButton} type="submit" disabled={!value.trim() || disabled}>
				전송
			</button>
		</form>
	);
}
