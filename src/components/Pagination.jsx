import PropTypes from 'prop-types';
import { IconButton, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CustomButton = ({ ...props }) => {
	return (
		<IconButton className="dark:hover:bg-base-300 data-[active=true]:!bg-primary cursor-pointer data-[active=true]:font-semibold data-[active=true]:!text-white" {...props} />
	);
};

const PaginButton = ({ maxPage, page, setPage, maxButton }) => {
	if (maxPage <= maxButton) {
		return [...Array(maxPage)].map((_, i) => (
			<CustomButton data-active={page === i + 1} key={i} variant={page === i + 1 ? 'filled' : 'text'} onClick={() => setPage(i + 1)}>
				{i + 1}
			</CustomButton>
		));
	}

	const maxL = Math.floor(maxButton / 2);
	const maxR = maxPage - (maxButton - maxL - 1) + 1;

	if (page <= maxL || page >= maxR) {
		return (
			<>
				{[...Array(Math.floor(maxButton / 2))].map((_, i) => (
					<CustomButton data-active={page === i + 1} key={i} variant={page === i + 1 ? 'filled' : 'text'} onClick={() => setPage(i + 1)}>
						{i + 1}
					</CustomButton>
				))}
				<Menu>
					<MenuHandler>
						<CustomButton variant="text">...</CustomButton>
					</MenuHandler>
					<MenuList className="!min-w-16">
						{[...Array(maxPage - maxButton + 1)].map((_, i) => (
							<MenuItem className="text-center" key={i} onClick={() => setPage(i + Math.floor(maxButton / 2) + 1)}>
								{i + Math.floor(maxButton / 2) + 1}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
				{[...Array(Math.floor(maxButton / 2))]
					.map((_, i) => i)
					.reverse()
					.map((i) => (
						<CustomButton data-active={page === maxPage - i} key={i} variant={page === maxPage - i ? 'filled' : 'text'} onClick={() => setPage(maxPage - i)}>
							{maxPage - i}
						</CustomButton>
					))}
			</>
		);
	}

	if (page < maxButton) {
		return (
			<>
				{[...Array(maxButton - 1)].map((_, i) => (
					<CustomButton data-active={page === i + 1} key={i} variant={page === i + 1 ? 'filled' : 'text'} onClick={() => setPage(i + 1)}>
						{i + 1}
					</CustomButton>
				))}
				<Menu>
					<MenuHandler>
						<CustomButton variant="text">...</CustomButton>
					</MenuHandler>
					<MenuList className="!min-w-16">
						{[...Array(maxPage - maxButton + 1)].map((_, i) => (
							<MenuItem className="text-center" key={i} onClick={() => setPage(i + maxButton)}>
								{i + maxButton}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
			</>
		);
	}

	if (page > maxPage - maxButton + 1) {
		return (
			<>
				<Menu>
					<MenuHandler>
						<CustomButton variant="text">...</CustomButton>
					</MenuHandler>
					<MenuList className="!min-w-16">
						{[...Array(maxPage - maxButton + 1)].map((_, i) => (
							<MenuItem className="text-center" key={i} onClick={() => setPage(i + 1)}>
								{i + 1}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
				{[...Array(maxButton - 1)]
					.map((_, i) => i)
					.reverse()
					.map((i) => (
						<CustomButton data-active={page === maxPage - i} key={i} variant={page === maxPage - i ? 'filled' : 'text'} onClick={() => setPage(maxPage - i)}>
							{maxPage - i}
						</CustomButton>
					))}
			</>
		);
	}

	const maxMid = maxButton - 2;
	const maxL2 = page - Math.floor(maxMid / 2) - 1;
	const maxR2 = page + Math.floor(maxMid / 2) + 1;

	return (
		<>
			<Menu>
				<MenuHandler>
					<CustomButton variant="text">...</CustomButton>
				</MenuHandler>
				<MenuList className="!min-w-16">
					{[...Array(maxL2)].map((_, i) => (
						<MenuItem className="text-center" key={i} onClick={() => setPage(i + 1)}>
							{i + 1}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
			{[...Array(maxMid)].map((_, i) => (
				<CustomButton data-active={page === maxL2 + i + 1} key={i} variant={page === maxL2 + i + 1 ? 'filled' : 'text'} onClick={() => setPage(maxL2 + i + 1)}>
					{maxL2 + i + 1}
				</CustomButton>
			))}
			<Menu>
				<MenuHandler>
					<CustomButton variant="text">...</CustomButton>
				</MenuHandler>
				<MenuList className="!min-w-16">
					{[...Array(maxPage - maxR2 + 1)]
						.map((_, i) => i)
						.reverse()
						.map((i) => (
							<MenuItem className="text-center" key={i} onClick={() => setPage(maxPage - i)}>
								{maxPage - i}
							</MenuItem>
						))}
				</MenuList>
			</Menu>
		</>
	);
};

const Pagination = ({ maxPage, page, setPage, maxButton = 5, className = '' }) => {
	if (page > maxPage) {
		setPage(maxPage);
	}
	return (
		<div className={`space-x-2 ${className}`}>
			<CustomButton variant="text" className="cursor-pointer hover:-translate-x-1" disabled={page == 1} onClick={() => setPage((prev) => prev - 1)}>
				<ArrowLeft size={20} />
			</CustomButton>
			<PaginButton maxPage={maxPage} page={page} setPage={setPage} maxButton={maxButton} />
			<CustomButton variant="text" className="cursor-pointer hover:translate-x-1" disabled={page == maxPage} onClick={() => setPage((prev) => prev + 1)}>
				<ArrowRight size={20} />
			</CustomButton>
		</div>
	);
};

Pagination.propTypes = {
	maxPage: PropTypes.number.isRequired,
	page: PropTypes.number.isRequired,
	setPage: PropTypes.func.isRequired,
	maxButton: PropTypes.number,
	className: PropTypes.string,
};

PaginButton.propTypes = {
	maxPage: PropTypes.number.isRequired,
	page: PropTypes.number.isRequired,
	setPage: PropTypes.func.isRequired,
	maxButton: PropTypes.number.isRequired,
};

export default Pagination;
