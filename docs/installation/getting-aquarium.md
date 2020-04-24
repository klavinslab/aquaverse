# Getting Aquarium

An Aquarium Docker image is available, see
<a href="#" onclick="select('Getting Started','Docker Installation')">
  Docker Installation
</a>
for more details.

Get Aquarium by using [git](https://git-scm.com) with the command

```bash
git clone https://github.com/klavinslab/aquarium.git
```

On Windows use

```bash
git clone https://github.com/klavinslab/aquarium.git --config core.autocrlf=input
```

By default, this gives you the repository containing the bleeding edge version of Aquarium, and you will want to choose the Aquarium version you will use.
Using the versioned branches (e.g., `aq_2.7`) will give you the latest version with bug fixes.

The most definitive way to find the latest release is to check the
<a href="#" onclick="select('Overview','Releases')">
    Aquarium Releases
</a>
,
take note of the latest tag number (e.g., v2.7.2), and then checkout the branch for that patch level.
For instance, if the desired tag is `v2.7.2` run the commands

```bash
cd aquarium
git checkout aq_2.7
```

(If you are doing Aquarium development, you'll want to work slightly differently.
See the [git tagging documentation](https://git-scm.com/book/en/v2/Git-Basics-Tagging) for details on working with git tags.)
