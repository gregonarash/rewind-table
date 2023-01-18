# What is Rewind Table?

>A rewind bench or rewind table is a workspace for rewinding, inspecting, and repairing film.

Rewind Table is a tool that allows to easily create video content from Airtable data at scale. It is built with [Remotion](https://remotion.dev) and contains connectors to easily plug into relevant base and fields on [Airtable](https://airtable.com). It is a great tool for creating video content for social media, product websites, and more.

Data is fetched from Airtable and then displayed in a video player using Remotion Player component. Video can be rendered locally using Remotion CLI.

The way frames are displayed inside the video player / video is controlled with use of:
* [Tailwind CSS](https://tailwindcss.com) classes 
* [Remotion Animated](https://www.remotion-animated.dev/) a composable animation library for Remotion 

This allows to easily customize the look and feel of the video and repeatably apply the same styles to multiple videos. 

# Airtable

Flexible no-code database [Airtable](https://airtable.com) frequently used for managing social media content production workflows and  e-commerce product catalogs.

# Remotion

[Remotion](https://remotion.dev) is a framework for creating videos programmatically, in React. It renders videos using the power of your CPU or can make use of cloud with Lambda functions. See great overview [here](https://www.youtube.com/watch?v=deg8bOoziaE). Remotion has a generous free license but also offers a paid license for commercial use, details [here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).


## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=rewind_table) or preview live with [StackBlitz](https://stackblitz.com/github/gregonarash/rewind-table)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/gregonarash/rewind-table&project-name=my-rewind-table&repository-name=rewind-table)

## How to use

Clone the repository and install dependencies:

```bash
git clone https://github.com/gregonarash/rewind-table.git
cd rewind-table
yarn
```

### Local development

Start the development server to access Airtable and player at localhost:3000 :

```bash
yarn dev
```

Start the Remotion preview server to access the Remotion preview player at localhost:3001 :

```bash
yarn video
```


### Render video

At the moment to render video locally you will have to temporary hard code the 'hash' value of the video you want to render in remotion/Root.tsx file. 

Change the following line:
```tsx
  const [hash, setHash] = useState<string | null>(
    window.location.hash.slice(1)
  );

```

To the following:
```tsx
  const [hash, setHash] = useState<string | null>(
    "#dngrebebjreg(base64 encoded hash with mapping to airtable)".slice(1)
  );

```

And run:
```bash
npx remotion render MainVideo out/video.mp4
```

## License

[Remotion License](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) is **NOT** MIT and has paid tiers. All Remotion packages included and derivate code in /remotion should not be considered MIT.

Remaining content is under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.