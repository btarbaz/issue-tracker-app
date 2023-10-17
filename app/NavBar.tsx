'use client';
import Link from 'next/link';
import { AiFillBug } from 'react-icons/ai';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';

const NavBar = () => {
  const pathName = usePathname();

  const links = [
    { href: '/', children: 'Dashboard' },
    {
      href: '/issues',
      children: 'Issues',
    },
  ];
  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <AiFillBug />
      </Link>
      <ul className="flex space-x-6">
        {links.map(link => (
          <li
            key={link.href}
            className={classNames({
              'text-zinc-900': link.href === pathName,
              'text-zinc-500': link.href !== pathName,
              'hover:text-zinc-800 transition-colors': true,
            })}
          >
            <Link href={link.href}>{link.children}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
