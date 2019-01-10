# Getting Aquarium

If you use a non-Windows system, do this by using [git](https://git-scm.com) with the command

```bash
git clone https://github.com/klavinslab/aquarium.git
```

On Windows use

```bash
git clone https://github.com/klavinslab/aquarium.git --config core.autocrlf=input
```

By default, this gives you the repository containing the bleeding edge version of Aquarium, and you will want to choose the Aquarium version you will use.
The most definitive way to find the latest release is to visit the [latest Aquarium release](https://github.com/klavinslab/aquarium/releases/latest) page at Github, take note of the tag number (e.g., v2.5.0), and then checkout that version.
For instance, if the tag is `v2.5.0` use the command

```bash
cd aquarium
git checkout v2.5.0
```

(If you are doing Aquarium development, you'll want to work slightly differently.
See the [git tagging documentation](https://git-scm.com/book/en/v2/Git-Basics-Tagging) for details on working with git tags.)


